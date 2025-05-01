import { WalletConnectButton } from "@/components/features/WalletConnectButton"

export default function ConnectPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Connect Your Wallet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect your MetaMask wallet to start trading
          </p>
        </div>
        
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    </main>
  )
}