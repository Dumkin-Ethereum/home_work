# Создание токена проекта
## Выполнил:
Думкин Никита
## Адрес контракта в сети Sepolia:
0xbaCe9C8A67DD4423D95f44edceE8a52Bb570EC39



# Аналитическая записка
## Общие сведения
msg, block и tx являются глобальными переменными, которые видимы во всем контракте
## msg
msg - переменная, которая содержит в себе данные транзакции
msg имееет следующие свойства:
+ data - полные данные calldata
+ sender - адрес аккаунта, который вызвал функцию контракта
+ sig - идентификатор функции
+ value - количество wei, отправленных с сообщением
## block
block - переменная, которая хранит информацию о блоке, в котором находится контракт
block имеет следующие свойства:
+ chainid - текущий идентификатор цепочки
+ coinbase - текущий адрес майнера блока
+ difficulty - текущая сложность блока
+ gaslimit - лимит газа в текущем блоке
+ number - текущий номер блока
+ timestamp - текущая временная метка блока в секундах с эпохи unix
## tx
tx хранит в себе данные о транзакции
tx имеет следующие свойства:
+ gasprice - количество газа за транзакцию
+ origin - адрес отправителя транзакции