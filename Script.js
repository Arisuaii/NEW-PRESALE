const paymentAddress = '2VfZ3LWcX1TaM6Yef1pvuueeW6FwjpTHAZfhP4VuXZEJ';
const solToUSD = 24.00; // Example rate for SOL to USD conversion
const paiPrice = 0.0007; // PAI price in USD

document.getElementById("presaleForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    let solAmount = parseFloat(document.getElementById("solAmount").value);
    let message = document.getElementById("message");

    if (solAmount >= 0.01 && solAmount <= 10) {
        try {
            const provider = window.solana;
            if (provider && provider.isPhantom) {
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
                const transaction = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: provider.publicKey,
                        toPubkey: new solanaWeb3.PublicKey(paymentAddress),
                        lamports: solanaWeb3.LAMPORTS_PER_SOL * solAmount,  // Convert SOL to lamports
                    })
                );
                const { signature } = await provider.signAndSendTransaction(transaction);
                await connection.confirmTransaction(signature);
                
                let paiTokens = (solAmount * solToUSD) / paiPrice;
                message.textContent = `Success! You have purchased ${paiTokens.toFixed(2)} PAI Tokens. Transaction: ${signature}`;
                message.style.color = "green";
            } else {
                alert('Solana wallet not found! Please install a compatible wallet.');
            }
        } catch (err) {
            console.error('Transaction error:', err);
            message.textContent = 'Transaction failed. Please try again.';
            message.style.color = "red";
        }
    } else {
        message.textContent = "Please enter a valid amount between 0.01 and 10 SOL.";
        message.style.color = "red";
    }
});
