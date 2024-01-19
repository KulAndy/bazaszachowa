const Menu = ({ links }) => {
  return (
    <nav>
      <ul class="desktop">
        {Object.keys(links).map((key) => (
          <li key={key}>
            <a href={links[key].url}>{links[key].name}</a>
          </li>
        ))}
      </ul>
      <details class="mobile">
        <summary>menu</summary>
        <ul>
          {Object.keys(links).map((key) => (
            <li key={key}>
              <a href={links[key].url}>{links[key].name}</a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
};

export default Menu;
