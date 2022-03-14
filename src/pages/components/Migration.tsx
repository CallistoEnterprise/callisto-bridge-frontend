import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { Spinner } from 'react-bootstrap'
import { Theme } from 'constants/theme'
import Spacer from 'components/Spacer'
import { migrationTokens } from 'constants/strings'
import { useTokenBalance } from 'hooks/wallet'
import useToast from 'hooks/useToast'
import { getBridgeAddress } from 'utils/decimal'
import { getBridgeContract, getTokenContract } from 'utils'
import AmtInput from './AmtInput'
import AssetsSelectorERC20 from './AssetsSelectorERC20'

const fromNetwork = {
    name: "Callisto Network",
    symbol: "CLO",
    devNet: "mainnet",
    chainId: "820",
    rpcs: ["https://clo-geth.0xinfra.com/"],
    explorer: "https://explorer.callisto.network/"
}
const web3 = new Web3(new Web3.providers.HttpProvider(fromNetwork.rpcs[0]))


const Migration = () => {
    const { account, chainId, library } = useWeb3React()
    const [curAsset, setCurAsset] = useState(migrationTokens[0])
    const [amt, setAmt] = useState("")
    const [isPendingTx, setIsPendingTx] = useState(false)
    const { toastWarning, toastError, toastSuccess } = useToast()

    const chainError = chainId !== 820

    const balances = useTokenBalance(fromNetwork, curAsset)
    const validBalance = chainId === 820 ? balances : "0.00"

    const handleAsset = (item) => {
        setCurAsset(item)
    }

    const handleMigrate = async () => {
        const amount = web3.utils.toWei(amt)
        const swapTokenAddr = curAsset.addresses[`${fromNetwork.symbol}`]
        try {
            const bridgeAddr = getBridgeAddress(chainId)
            const tkContract = getTokenContract(swapTokenAddr, library, account);
            const allowed = await tkContract.allowance(account, bridgeAddr, {value:0});
            if( allowed < amount ) {
                await tkContract.approve(bridgeAddr, ethers.constants.MaxUint256, {value:0})
            }
            const bridgeContract = getBridgeContract(bridgeAddr, library, account)
            const tx = await bridgeContract.migrate(swapTokenAddr, amount, {value: 0})
            setIsPendingTx(true)
    
            const receipt = await tx.wait()
            if( receipt.status ) {
                toastSuccess("Success!", `${curAsset.symbol} Token migrated to ERC223 token successfully.`)
                setIsPendingTx(false)
                setAmt('')
            }
        } catch(err) {
            toastError("Migration Error!", "Failed to migrate. Please try again.")
            setIsPendingTx(false)
        }
    }

    const handleMaxAmount = () => {
        setAmt(validBalance.toString())
    }

    return (
        <Container>
            <Title>ERC20 to ERC223 Tokens Migration</Title>
            <Spacer height="10px" />
            <StyledText>Please migrate your ccETH and ccBNB tokens from ERC 20 to ERC223.</StyledText>
            <Spacer height="20px" />
            <AssetsSelectorERC20 curToken={curAsset} changeAsset={(item)=>handleAsset(item)} balance={validBalance}/>
            <Spacer height="20px" />
            <Row>
                <AmtInput value={amt} handleChange={(val)=>{
                    if (parseFloat(validBalance.toString()) < val) {
                        toastWarning("Warning!", "You have not enough balance.")
                        return
                    }
                    setAmt(val)
                }}/>
                { account && <MaxButton onClick={handleMaxAmount}>MAX</MaxButton>}
            </Row>
            <Spacer height="20px" />
            <StyledButton 
                disabled={
                    chainError ||
                    isPendingTx ||
                    amt === ""  ||
                    parseFloat(amt) === 0
                }
                onClick={handleMigrate}
            >
                {isPendingTx ? <Spinner animation="border" role="status" />:
                <p>Migrate</p>}
            </StyledButton>
        </Container>
    )

}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${Theme.colors.primary};
    padding: 20px;
`
const Title = styled.p`
    color: ${Theme.colors.primary};
    font-family: ${Theme.fonts.textBold};
    font-size: 20px;
    text-align: center;
`
const StyledText = styled.p`
    color: ${Theme.colors.secondary};
    font-family: ${Theme.fonts.medium};
    text-align: center;
`
const StyledButton = styled.button<{disabled: boolean}>`
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    border: none;
    font-size: 26px;
    font-family: ${Theme.fonts.textBold};
    color: ${({disabled}) => disabled? `#51768d`: Theme.colors.secondary};
    background-color: ${({disabled}) => disabled? `#7ea594`: Theme.colors.primary};
    :hover {
        background-color: ${({disabled}) => disabled? `#7ea594`: Theme.colors.secondary};
        color: ${({disabled}) => disabled? `#51768d`: Theme.colors.white};
    }
`;
const MaxButton = styled.button`
    position: absolute;
    right: 10px;
    bottom: 7px;
    width: 70px;
    padding: 10px;
    border-radius: 10px;
    font-size: 16px;
    border: none;
    height: 40px;
    font-family: ${Theme.fonts.textBold};
    color: ${Theme.colors.secondary};
    background-color: ${Theme.colors.primary};
    :hover {
        background-color: ${Theme.colors.secondary};
        color: ${Theme.colors.white};
    }
`
const Row = styled.div`
    display: flex;
    aligin-items: center;
    position: relative;
`

export default Migration
