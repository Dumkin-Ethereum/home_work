// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

contract EventContract {

  uint public number = 1;

  struct Transaction {
    address _to;
    uint _value;
    bool _successful;
  }

  event TransactionNotification(address indexed from, Transaction _transaction, bool indexed _wasDeleted);

  mapping(address => Transaction) public map;

  function sendTransaction(address _to) public payable {

    address payable to = payable(_to);
    to.transfer(msg.value);

    Transaction memory _transaction = Transaction(_to, msg.value, true);

    map[msg.sender] = _transaction;
    emit TransactionNotification(msg.sender, _transaction, false);
  }

  function clearHistory() public {

    Transaction memory _transaction = map[msg.sender];
    delete map[msg.sender];
    emit TransactionNotification(msg.sender, _transaction, true);
  }

}