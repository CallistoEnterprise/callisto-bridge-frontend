import { useWeb3React } from '@web3-react/core';
import Spacer from 'components/Spacer';
import { Assets } from 'constants/images';
import { addTokenList } from 'constants/strings';
import { Theme } from 'constants/theme';
import useToast from 'hooks/useToast';
import React from 'react'
import styled from 'styled-components';
import { registerToken } from 'utils/wallet';

const Container = styled.div`
    background-color: #FFFFFF;
    padding: 40px 20px;
    border-radius: 20px;
    width: 260px;
    min-width: 260px;
    max-height: 980px;
    @media screen and (max-width: 600px){
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

const Title = styled.p`
    font-size: 20px;
    font-family: ${Theme.fonts.medium};
    line-height: 30px;
    color: ${Theme.colors.secondary};
`;

const Title2 = styled.p`
    font-size: 18px;
    font-family: ${Theme.fonts.textBold};
    color: ${Theme.colors.primary};
    line-height: 20px;
    text-align: center;
`;
const StyledText = styled.p`
    font-size: 14px;
    font-family: ${Theme.fonts.text};
    line-height: 18px;
    color: ${Theme.colors.secondary};
`;

const StyledLink = styled.a`
    font-size: 16px;
    font-family: ${Theme.fonts.medium};
    line-height: 18px;
    color: ${Theme.colors.primary};
`;

const StyledImg = styled.img`
    margin: 50px 0;
    @media screen and (max-width: 600px){
        width: 240px;
        margin: 20px 0;
    }
`;
const StyledBtn = styled.div`
    margin-top: 10px;
    border: 1px solid ${Theme.colors.primary};
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 14px;    
    font-family: ${Theme.fonts.medium};
    max-width: 180px;
    width: 180px;
    display: flex;
    align-items: center;
    &:hover {
        cursor: pointer;
        color: white;
        background-color: ${Theme.colors.primary};
    }    
`
const StyledIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 5px;
`
const TokensDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1), 0 5px 10px 0 rgba(0, 0, 0, 0.1);
    padding: 20px 10px;
    border-radius: 10px;
    border: 1px solid rgba(50,50,50,.1);
`
const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 300px;
    padding: 0 10px;
    margin: 20px 0 0;
    overflow-y: auto;
    overflow-x: hidden;
`

const Bridge: React.FC = () => {
    const { account, chainId } = useWeb3React();
    const { toastError } = useToast()

    const handleAddToken = (item) => {
        if (item.chainId !== chainId) {
            toastError('Wrong Network!', `Please switch network to ${item.network}`)
            return
        }
        registerToken(item.address, item.symbol, item.decimals)
    }

    return (
        <Container>
            <Title>Callisto Bridge V2</Title>
            <Spacer height="20px" />
            <StyledText>Allow user to transfer tokens from one chain to another.</StyledText>
            <Spacer height="10px" />
            <StyledText>ERC223 and ERC20 tokens supported.</StyledText>
            <Spacer height="20px" />
            <StyledLink>View Assets Lists</StyledLink>
            <Spacer height="10px" />
            <StyledLink href="https://callisto.network/cross-chain-bridges-security-model/" target="_blank">Callisto Bridge Security Model</StyledLink>
            <Spacer height="40px" />
            {account && <TokensDiv>
                <Title2>Add Tokens to Metamask</Title2>
                <Content>
                    {
                        addTokenList.map((item) => {
                            return (
                                <StyledBtn key={`${item.symbol}-${item.network}`} onClick={() => handleAddToken(item)}>
                                    <StyledIcon src={`/images/${item.address}.png`} alt=""/>
                                    {`${item.symbol} in ${item.network}`}
                                </StyledBtn>
                            )
                        })
                    }
                </Content>
            </TokensDiv>}
            <Spacer height="20px" />
            <StyledImg src={Assets.back} />
        </Container>
    )
}

export default Bridge;
