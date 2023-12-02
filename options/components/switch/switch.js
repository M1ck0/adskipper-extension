customElements.define('switch-button', class extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'label', 'tooltip'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'id') {
      this.querySelector('input[type="checkbox"]').id = newValue;
    }
    
    if (name === 'label') {
      this.querySelector('.switch-parent p').textContent = newValue;
    }
    
    if (name === 'tooltip') {
      this.querySelector('.switch-parent .tooltip').textContent = newValue;
    }
  }
  
  get checked() {
    return this.querySelector('input[type="checkbox"]').checked;
  }
  
  set checked(isChecked) {
    this.querySelector('input[type="checkbox"]').checked = isChecked;
  }
  
  constructor() {
    super();
    this.innerHTML = `
      <link rel="stylesheet" href="./components/switch/switch.css">
      <div class="switch-parent">
        <div class="container">
          <p class="label"></p>
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
        </div>
        <p class="tooltip"></p>
      </div>`;
  }
});
