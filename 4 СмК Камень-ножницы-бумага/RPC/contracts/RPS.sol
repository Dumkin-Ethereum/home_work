// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RPS{

    event RevealAnwer (address player, string choice);

    string[] public variants = [
    "rock",
    "paper",
    "scissors"
    ];

    struct GameData{
        bytes32 commit;
        bool isParticipant;
    }

    mapping(address => GameData) public participantsData;
    address[] participants;
    bool votingStopped;

    modifier registrationIsPossible (){
        require(participants.length != 2);
        _;
    }

    function registration() public registrationIsPossible() { //FUNC
        participantsData[msg.sender] = GameData(0, true);
        participants.push(msg.sender);
    }

    modifier choiceAvailable () {
        require(!votingStopped);
        require(participantsData[msg.sender].isParticipant == true);
        require(participantsData[msg.sender].commit == bytes32(0));
        _;
    }

    modifier stopVoting() {
        _;
        if(participantsData[participants[0]].commit != bytes32(0) && participantsData[participants[1]].commit != bytes32(0)){
            votingStopped = true;
        }
    }

    function choose(bytes32 _hashedChoice) external choiceAvailable() stopVoting(){ //FUNC
        participantsData[msg.sender].commit = _hashedChoice;
    }

    function revealChoice(uint _choice, bytes32 _secret) external { //FUNC
        require(votingStopped);

        bytes32 commit = keccak256(abi.encodePacked(_choice, _secret, msg.sender));

        require(commit == participantsData[msg.sender].commit);

        emit RevealAnwer(msg.sender, variants[_choice]);
    }

}