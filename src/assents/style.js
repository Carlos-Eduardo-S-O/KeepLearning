import styled from "styled-components/native"

export const Avatar = styled.Image`
    padding: 4px;
    width: 36px;
    height: 36px;
    border-radius: 18px;
`;

export const Title = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #59594a;  
`;

export const Title2 = styled.Text`
    font-size: 13px;
    font-weight: bold;
    color: #59594a;  
`;

export const Description = styled.Text`
    font-size: 13px;
    color: #000;
    text-align: justify;
`; 

export const OnTheSameLine = styled.View`
    flex-direction: row;
    align-items: baseline;
`;

export const SpecialOnTheSameLine = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

export const Container = styled.View`
    padding-top: 3px;
    padding-right: 15px;
    padding-left: 15px;
    padding-bottom: 10px;
    text-align: justify;
`;

export const Justify = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;

export const SearchField = styled.TextInput`
    height: 40px;
    width: 100%;
    background-color: #fff;
    border-color: #c7c7c7;
    border-width: 1px;
    border-radius: 8px;
`;

// Menu properies

export const ContainerMenu = styled.View`
    flex: 1;
    font-size: 16px;
    background-color: #fff;
`;

export const RightOnTheSameLine = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
`;
export const MenuOption = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #59594a;  
`;

export const MenuDivisor = styled.View`
    marginHorizontal: 5px;
    border-bottom-width: 1px;
    border-color: #aaa;
`;

export const ButtonContainer = styled.View`
    margin: 15px;
`;

export const IconContainer = styled.View`
    padding: 4px;
`;

export const Center = styled.Text`
    text-align: center;
`;

export const CenterAddComment = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5%;
    margin-right: 5%;
`;

export const AddCommentContainer = styled.View`
    width: 280px;
    margin-top: 50%;
    margin-left: auto;
    margin-right: auto;
    background-color: #fff;
    padding: 10px;
    border: solid;
    border-radius: 10px;
    border-color: #ccc;
`;

export const ButtonAddComment = styled.View`
    padding-top: 5px;
    width: 100px;
`;

export const InputAddComment = styled.View`
    width: 230px;
    border-bottom-width: 1px;
    border-color: #ccc;
    margin-left: auto;
    margin-right: auto;
`;

export const DeleteCommentContainerView = styled.View`
    position: relative;
    width: 50px;
    height: 110px;
    background-color: #ff6666;
`;

export const CenterDeleteView = styled.View`
    position: absolute;
    width: 28px;
    height: 28px;
    top: 50%;
    left: 50%;
    margin-top: -14px;
    margin-left: -14px; 
`;