import React from 'react'
import { Theme } from 'constants/theme';
import styled from 'styled-components';
import { FaExclamationCircle } from 'react-icons/fa';

const Container = styled.div`
    display: flex;
    width: 100%;
    background-color: rgba(255, 0, 80, .1);
    border-radius: 10px;
    border: 1px solid #f70556;
    padding: 5px 10px;
    align-items: center;
    margin-top: 10px;
`;


const StyledText = styled.p<{color: string}>`
    font-size: 14px;
    font-family: ${Theme.fonts.text};
    line-height: 18px;
    color: ${({color}) => color};
    margin-left: 10px;
    @media screen and (max-width: 600px) {
        width: calc(100% - 40px);
    }
`;

const NotSupported = () => {

    return (
        <Container>
            <FaExclamationCircle size={30} color="#f70556" />
            <StyledText color="#f70556">Current asset is not supported yet! Please select another asset or network.</StyledText>
        </Container>
    )
}

export default NotSupported;
