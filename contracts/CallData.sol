//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract CallData {
    int256 private id;

    function setId(int256 _id) external {
        id = _id;
    }
}
