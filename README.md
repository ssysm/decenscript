## Inspiration

During my college transferring process, the amount of transcript I've send and the amount of undelivered transcript took a lot of time to address them, so Decenscript is trying to solve the problem of sending transcripts between different academic institutions by putting the transcript onto the blockchain and mint into an NFT.

## What it does

Decenscript is a decentralized, always trusted and highly secure grade keeping and transcript platform that interact directly with the instructors at the institutions and the students where they can mint/sign a digital report card for an individual course that is on the blockchain. During signing, a cryptographic hash function will hash the student's wallet address, instructors wallet address and the letter grade to future ensure the integrity of the report.

## How we built it

We used solidity to program smart contract on the Polygon network using the ERC721 standard. The frontend stack used angular as the web framework and AntD UI as the UI library. The stack is deployed on Google Cloud Platform and using Cloud Firestore to store all metadata of the token.

## Challenges we ran into

The reason why we chosen Polygon network instead of the regular Ethereum network is because of the high gas fee and the slow transaction speed. We also ran into the problem of the frontend not being able to connect to the smart contract because of the CORS issue.
We also ran into the problem of the frontend not being able to connect to the smart contract because of the browsers issues.

## Accomplishments that we're proud of

We are proud of the fact that we are able to build a fully functional web application that is able to interact with the smart contract on the Polygon network and we are specifically proud we learned solidity in a short period of time.

## What we learned

We learned that there's so much behind a well built dApp(Decentralized Application), a lot of security and privacy issues that we need to take care of. We also learned that the frontend is not the only thing that we need to focus on, we also need to focus on the backend and the smart contract.
But since we used Google Cloud Platform, we didn't have to worry about the backend that much in this project.

## What's next for Decenscript

We want to add more features to the platform such as the ability to sign a transcript for a whole semester and the ability to sign a transcript for a whole year and even for a whole degree program. 
We would also like to add more security and integrity features to the platform.
