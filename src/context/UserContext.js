import React from 'react'


export const UserContext = React.createContext();

export default UserContext;

// export const UserContext = React.createContext({
//     userName: ''
// })

// export default props => {

//     const [user, setUser] = useState('');
//     return (
//         <UserContext.Provider value={{userName:user, setUser }}>
//             {props.children}
//         </UserContext.Provider>

//     )
// }