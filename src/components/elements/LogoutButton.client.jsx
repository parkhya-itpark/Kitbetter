export function LogoutButton(props) {
  const logout = () => {
    fetch('/account/logout', {method: 'POST'}).then(() => {
      localStorage.removeItem('items');
      if (typeof props?.onClick === 'function') {
        props.onClick();
      }
      window.location.href = '/';
    });
  };

  return (
    <button className="text-primary/50" {...props} onClick={logout}>
      Logout
    </button>
  );
}
