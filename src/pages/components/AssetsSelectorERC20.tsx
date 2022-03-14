import React, { useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3';
import { migrationTokens } from 'constants/strings';
import { Theme } from 'constants/theme';
import styled from 'styled-components';
import Modal from 'styled-react-modal'
import getImageUrl from 'utils/getImageUrl';

const Container = styled.div`
    width: calc(100%);
`;

const Title = styled.p`
    font-size: 16px;
    font-family: ${Theme.fonts.textBold};
    line-height: 30px;
    color: ${Theme.colors.secondary};
`;

const StyledButton = styled.div`
    background-color: #f5f5f5;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const StyledButton2 = styled.button`
    width: 100%;
    border: none;
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${Theme.colors.primary};
`;

const StyledText = styled.p`
    font-size: 14px;
    font-family: ${Theme.fonts.text};
    line-height: 18px;
    color: ${Theme.colors.secondary};
`;
const StyledErrorText = styled.p`
    font-size: 14px;
    font-family: ${Theme.fonts.text};
    line-height: 18px;
    color: #f70556;
`;

const StyledImg = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 10px;
`;

const StyledModal = Modal.styled`
    width: 35%;
    min-width: 300px;
    max-width: 350px;
    // height: 400px;
    border-radius: 20px;
    background-color: #f5f5f5;
`
const BottomSection = styled.div`
    margin: 20px 10px 10px;
    width: calc(100% - 20px);
    // height: 300px;
    background-color: #FFF;
    border-radius: 20px;
`;

const LogoDiv = styled.div`
    display: flex;
    align-items: center;
`

const AssetsSelectorERC20 = ({curToken, changeAsset, balance}) => {
    const { chainId, account } = useActiveWeb3React()
    const [isOpen, setIsOpen] = useState(false)

    function toggleModal() {
      setIsOpen(!isOpen)
    }

    function handleSelect(e, item) {
        changeAsset(item);
        toggleModal();
    }

    return (
        <Container>
            <Title>Assets</Title>
            <StyledButton onClick={toggleModal}>
                <LogoDiv>
                    <StyledImg src={getImageUrl(curToken.symbol2)} alt="logo_img"/>
                    <StyledText>{`${curToken.symbol} in ${curToken.network}`}</StyledText>
                </LogoDiv>
                {
                    chainId === 820 ?
                    <StyledText>{balance} {curToken.symbol}</StyledText>:
                    <StyledErrorText>{account? `Switch Network` : `Connect wallet`}</StyledErrorText>
                }
            </StyledButton>
            <StyledModal
                isOpen={isOpen}
                onBackgroundClick={toggleModal}
                onEscapeKeydown={toggleModal}
            >
                <BottomSection>
                    {
                        migrationTokens.map((item) => (
                            <StyledButton2
                                onClick={(e) => handleSelect(e, item)}
                                key={item.symbol}
                            >
                                <StyledImg src={getImageUrl(item.symbol2)} alt="logo_img"/>
                                <div>
                                    <StyledText>{item.symbol}</StyledText>
                                </div>
                            </StyledButton2>
                        ))
                    }
                </BottomSection>
            </StyledModal>
        </Container>
    )
}

export default AssetsSelectorERC20;
