export default function Prueba(){

    return (
            <div id="root">
                <img src={logo} id="logo" alt="logo"/>
                <div id="result" className="result">{resultText}</div>
                <div id="input" className="input-box">
                    <input id="name" className="input" onChange={updateName} autoComplete="off" name="input" type="text"/>
                    <button className="btn" onClick={greet}>Greet</button>
                </div>
                <div id="result" className="result">{resultSum}</div>
                <div id="input" className="input-box">
                    <input id="numero" className="input" onChange={updateNumero} autoComplete="off" name="input" type="text"/>
                    <button className="btn" onClick={sumar}>Sumar</button>
                </div>
                <div style={{height:'100vh'}}></div>
            </div>    
    )
}