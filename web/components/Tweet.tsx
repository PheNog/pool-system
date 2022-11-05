type Tweet = {
    text: string
}

export const Tweet = (props: Tweet) => {
    return (
        <div>
            <h1> TWEET </h1>
            <p> {props.text} </p>
            <button>CURTIR</button>
        </div>
    )
}