# wallet-test

cd into directory of choice 
git clone https://github.com/pkmazarakis/wallet-test.git
yarn install
yarn start 

wallet address and private key are hard coded inside constants

for testing: 
-- add wallet address to send FAU to (there is default already stored)
-- enter amount 
-- press approve button 
-- if accepted, press transfer

other tests: 
-- code can handle most testing
  -- missing inputs (address, amount)
  -- not enough funds 
  -- not approved before transfering 
  
included:
-- figma file: https://www.figma.com/file/NcRBHa4votQApztBLghyTR/Wallet-Test-Figma

time taken:
-- figma --> 45 min
-- frontend (setup, navigation, ui) --> 45 min
-- learning ethersjs --> 4 hours 
-- debugging --> 3 hours 
-- miscellaneous (validation, fonts, colors, styleguide, etc.) --> 1 hours
