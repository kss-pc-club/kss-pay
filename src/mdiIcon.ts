const mdiIcon = () => {
  document.querySelectorAll('mdi-icon').forEach((element) => {
    const i = document.createElement('i')
    i.className = element.className
    const iconName = element.getAttribute('icon')
    if (iconName) {
      i.classList.add(...['mdi', `mdi-${iconName}`])
    }
    element.insertAdjacentElement('afterend', i)
    element.remove()
  })
}

export { mdiIcon }
