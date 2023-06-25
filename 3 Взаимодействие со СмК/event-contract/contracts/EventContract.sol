// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EventContract {

  struct Transaction {
    address _to;
    uint _value;
    bool _successful;
  }

  event TransactionNotification(Transaction _transaction, bool _wasDeleted);

  mapping(address => Transaction) public map;

  function sendTransaction(address to) public payable {

    address payable _to = payable(to);
    _to.transfer(msg.value);

    Transaction memory _transaction = Transaction(to, msg.value, true);

    map[msg.sender] = _transaction;
    emit TransactionNotification(_transaction, false);
  }

  function clearHistory() public {

    Transaction memory _transaction = map[msg.sender];
    delete map[msg.sender];
    emit TransactionNotification(_transaction, false);
  }

}