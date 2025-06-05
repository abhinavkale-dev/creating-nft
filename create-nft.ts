import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js"
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("User", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser))

console.log("Set up umi instance for users");

const collectionAddress = new PublicKey("7vVmt2g8sqvdzJWwiBh5CtwM4nhBjHYXzRbFmgCiaNTz");

console.log(`Creating NFT..`);

const mint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint,
    name: "NFT",
    symbol: "NG",
    uri: "https://raw.githubusercontent.com/rperrot/ReconstructionDataSet/master/BoutevilleWindowDetail/DPP_0785.JPG",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: publicKey(collectionAddress.toBase58()),
        verified: false
    }
})
await transaction.sendAndConfirm(umi);

console.log(`Created NFT! Address is ${getExplorerLink("address", mint.publicKey, "devnet")}`)






