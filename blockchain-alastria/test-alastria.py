from easyweb3 import EasyWeb3


data_example = 'procardia_message:Proof registered by Procardia::procardia_proof:a3799f91e5495128a918f6c7f5aef65564384240824d81244244a4ecde60765d'

address = EasyWeb3.web3.toChecksumAddress('0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddea1')
web3 = EasyWeb3('wallet.json', http_provider='http://65.52.226.126:22000', proof_of_authority=True)

tx = web3.get_tx(to=address, data=bytes(data_example, 'utf-8'))
receipt = web3.transact(tx)

print(receipt)
