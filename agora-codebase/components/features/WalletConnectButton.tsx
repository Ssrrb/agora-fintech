"use client";
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { useAccount, useConnect } from "wagmi"
// Correct import for wagmi v2+ connectors
import { metaMask } from "wagmi/connectors" 
import { useState } from "react"
import { Loader2 } from "lucide-react"

export const WalletConnectButton = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isSignedIn } = useAuth()
  const { address, isConnected } = useAccount()
  
  // useConnect hook doesn't take the connector directly in options in v2+
  const { connect } = useConnect() 

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Pass the connector configuration to the connect function
      await connect({ connector: metaMask() }) 
    } catch (error) {
      // It's good practice to check if the error is specific, 
      // e.g., user rejecting the connection, which isn't necessarily a code error.
      if ((error as { name?: string }).name !== 'UserRejectedRequestError') {
         console.error("Failed to connect wallet:", error)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  if (!isSignedIn) return null

  if (isConnected && address) {
    return (
      <Button variant="outline" disabled>
        {`${address.slice(0, 6)}...${address.slice(-4)}`} {/* Slightly longer prefix for better readability */}
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  )
}