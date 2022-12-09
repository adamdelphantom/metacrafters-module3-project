import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";

// TODO: inject toWallet account
// optional TODO: output ../spl-token-info-json

(async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fromWallet = Keypair.generate();
  const toWalletPublicKey = new PublicKey(
    "7uroHU7mZYTh9nQYh6jiZVpCdeewZKhsA5fAedaiELzz"
  );

  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL / 2
  );
  await connection.confirmTransaction(fromAirdropSignature, {
    commitment: "confirmed",
  });

  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9
  );
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  let signature = await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    100000000000,
    []
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWalletPublicKey
  );
  signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    100000000000,
    []
  );
})();
