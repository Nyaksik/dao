//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error IncorrectAmount(uint256, uint256);
error ProposalInProgress();
error ProposalIsOver();
error NotFoundProposalId(uint256);
error AlreadyVoted();

contract DAO is Ownable {
    enum ProposalStatus {
        NONE,
        PROGRESS,
        SUCCESS,
        REJECTED
    }

    enum Decision {
        NONE,
        FOR,
        AGAINST
    }

    struct Proposal {
        uint256 id;
        ProposalStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 votes;
        uint256 votesFor;
        uint256 votesAgainst;
        address recipient;
        bytes callData;
        string description;
    }

    struct Participant {
        uint256 depositAmount;
        uint256 endTime;
        mapping(uint256 => Decision) votes;
    }

    address public tokenDAO;
    uint256 public totalProvided;
    uint256 public proposalId;
    uint32 public constant PROPOSAL_DURATION = 3 days;
    uint32 public constant MINIMUN_QUORUM = 60;
    uint32 public constant REQUISITE_MAJORITY = 51;

    mapping(uint256 => Proposal) private proposals;
    mapping(address => Participant) private participants;

    constructor(address _token) {
        tokenDAO = _token;
    }

    function getProposal(uint256 _id) external view returns (Proposal memory) {
        if (_id <= 0 && _id > proposalId) revert NotFoundProposalId(_id);
        Proposal memory proposal = proposals[_id];
        return proposal;
    }

    function deposite(uint256 _amount) external {
        IERC20(tokenDAO).transferFrom(msg.sender, address(this), _amount);
        Participant storage participant = participants[msg.sender];
        participant.depositAmount += _amount;
        if (participant.endTime == 0) participant.endTime = block.timestamp;
        totalProvided += _amount;
    }

    function withdraw(uint256 _amount) external {
        Participant storage participant = participants[msg.sender];
        if (_amount > participant.depositAmount)
            revert IncorrectAmount(_amount, participant.depositAmount);
        if (block.timestamp < participant.endTime) revert ProposalInProgress();
        participant.depositAmount -= _amount;
        totalProvided -= _amount;
        IERC20(tokenDAO).transfer(msg.sender, _amount);
    }

    function addProposal(bytes calldata _callData, string memory _description)
        external
        onlyOwner
    {
        proposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            status: ProposalStatus.PROGRESS,
            startTime: block.timestamp,
            endTime: block.timestamp + PROPOSAL_DURATION,
            votes: 0,
            votesFor: 0,
            votesAgainst: 0,
            recipient: msg.sender,
            callData: _callData,
            description: _description
        });
    }

    function vote(
        uint256 _id,
        uint256 _amount,
        Decision _decision
    ) external {
        if (_id <= 0 && _id > proposalId) revert NotFoundProposalId(_id);
        Proposal storage proposal = proposals[_id];
        if (proposal.endTime >= block.timestamp) revert ProposalIsOver();
        Participant storage participant = participants[msg.sender];
        if (_amount > participant.depositAmount)
            revert IncorrectAmount(_amount, participant.depositAmount);
        if (participant.votes[_id] != Decision.NONE) revert AlreadyVoted();
        if (participant.endTime < proposal.endTime)
            participant.endTime = proposal.endTime;
        participant.votes[_id] = _decision;
        proposal.votes += _amount;
        if (_decision == Decision.FOR) proposal.votesFor += _amount;
        if (_decision == Decision.AGAINST) proposal.votesAgainst += _amount;
    }

    function finishProposal(uint256 _id) external {
        if (_id <= 0 && _id > proposalId) revert NotFoundProposalId(_id);
        Proposal storage proposal = proposals[_id];
        if (proposal.endTime < block.timestamp) revert ProposalInProgress();
        if (proposal.status != ProposalStatus.PROGRESS) revert ProposalIsOver();
        if (
            _isMinimunQuorum(proposal.votes, totalProvided) &&
            _isRequisiteMajority(proposal.votes, proposal.votesFor)
        ) {
            (bool success, ) = proposal.recipient.call(proposal.callData);
            if (success) {
                proposal.status = ProposalStatus.SUCCESS;
            } else {
                proposal.status = ProposalStatus.REJECTED;
            }
        } else {
            proposal.status = ProposalStatus.REJECTED;
        }
    }

    function _isMinimunQuorum(uint256 _votesCount, uint256 _totalProvided)
        private
        pure
        returns (bool)
    {
        uint256 _percent = (_votesCount / _totalProvided) * 100;
        if (_percent >= MINIMUN_QUORUM) {
            return true;
        } else {
            return false;
        }
    }

    function _isRequisiteMajority(uint256 _votesCount, uint256 _votesFor)
        private
        pure
        returns (bool)
    {
        uint256 _percent = (_votesCount / _votesFor) * 100;
        if (_percent >= REQUISITE_MAJORITY) {
            return true;
        } else {
            return false;
        }
    }
}
