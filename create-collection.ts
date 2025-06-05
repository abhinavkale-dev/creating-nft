import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL} from "@solana/web3.js"
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("User", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser))

console.log("Set up umi instance for users");

const collectionMint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "Collection",
    symbol: "NG",
    uri: "https://raw.githubusercontent.com/rperrot/ReconstructionDataSet/master/BoutevilleWindowDetail/DPP_0785.JPG",
    sellerFeeBasisPoints: percentAmount(0)
})
await transaction.sendAndConfirm(umi);

console.log(`Created collection 📦! Address is  ${getExplorerLink("address", collectionMint.publicKey, "devnet")}`)



