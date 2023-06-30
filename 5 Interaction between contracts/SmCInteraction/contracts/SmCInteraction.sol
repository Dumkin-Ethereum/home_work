// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SmCInteraction{

    address RPSAddress = 0x76213E55579cEa798b11F868e5d2049F075270F2;

    RPSInterface rpsInterface = RPSInterface(RPSAddress);

    function registrate() external returns(bool){
        return rpsInterface.registration();
    }
}

interface RPSInterface{
    function registration() external returns(bool);
}