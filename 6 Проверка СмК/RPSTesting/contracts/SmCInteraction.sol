// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SmCInteraction{

    address public RPSAddress;
    RPSInterface rpsInterface;

    constructor(address contractAddress){
        RPSAddress = contractAddress;
        rpsInterface = RPSInterface(RPSAddress);
    }

    function registrate() external returns(bool){
        return rpsInterface.registration();
    }
}

interface RPSInterface{
    function registration() external returns(bool);
}