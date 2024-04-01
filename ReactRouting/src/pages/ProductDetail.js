import { Link, useParams } from "react-router-dom"

export default function ProductDetail () {
    const params = useParams()

    return (<>
        <h1> product details</h1>
        <p>{params.productId}</p>
        <p><Link to=".." relative="path"> Back</Link></p>
    </>)
}