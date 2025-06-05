import { createNft, fetchDigitalAsset, findMetadataPda, mplTokenMetadata, verifyCollection, findMasterEditionPda } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {clusterApiUrl, Connection, LAMPORTS_PER_SOL} from "@solana/web3.js"
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

const collectionAddress = publicKey("7vVmt2g8sqvdzJWwiBh5CtwM4nhBjHYXzRbFmgCiaNTz");

const nftAddress = publicKey("GTYhRbftubUFBosB7YiUCzBWu37zakREiZbV4yHteidz");

const transaction = await verifyCollection(umi, {
    metadata: findMetadataPda(umi, {mint: nftAddress}),
    collectionMint: collectionAddress,
    collection: findMetadataPda(umi, {mint: collectionAddress}),
    collectionMasterEditionAccount: findMasterEditionPda(umi, {mint: collectionAddress}),
    collectionAuthority: umi.identity,
});

transaction.sendAndConfirm(umi);

console.log(`NFT ${nftAddress} verified as member of collection ${collectionAddress}! See explorer: ${getExplorerLink("address", nftAddress, "devnet")}`);
