import { UI } from "./constants"

export const Table = ({children } : {children : any}) => {

    const style : React.CSSProperties = {
        borderTop: "0.25px solid black",
        borderLeft: "0.25px solid black",
        borderRight: "0.25px solid black",
        width : UI.PDF.maxWdith.landscape,
        boxSizing : "border-box",
        padding: "0px",
        margin: "0px",
        borderCollapse : "collapse"
    }
    return (
        <div style={{ maxHeight : "108mm" , width : UI.PDF.maxWdith.landscape  }}>
            <table style={style}>
                {children}
            </table>
        </div>
    )
}

export const TRow = ({children } : {children : any}) => {

    const style : React.CSSProperties = {
        borderBottom : "0.25px solid black",
        boxSizing : "border-box",
    }
    return (
        <tr style={style}>
            {children}
        </tr>
    )
}

export const THead = ({children } : {children : any}) => {

    const style : React.CSSProperties = {
        fontSize : "6px",
        height: "20px",
        paddingLeft : "4px",
        paddingRight : "4px",
    }
    return (
        <th style={style}>
            {children}
        </th>
    )
}
export const TData = ({children } : {children : any}) => {

    const style : React.CSSProperties = {
        fontSize : "6px",
        height: "20px",
    }
    return (
        <td style={style}>
            {children}
        </td>
    )
}
