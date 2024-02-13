const Button = ({title,activeClass, _callback}) => {
    return (
        <button  lassName={`btn-pomodoro ${activeClass}`} onClick={_callback}>{title}</button>
      )
}
export default Button