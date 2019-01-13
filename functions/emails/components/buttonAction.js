const build = (templateData) => {
  return `
    <mj-section background-color="#fff">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="16px 25px 4px 25px">${templateData[0]}</mj-text>
        <mj-text align="center" color="#333" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="4px 25px 16px 25px">${templateData[1]}</mj-text>
        <mj-button background-color="#ba1b1d" color="#FFF" font-size="14px" align="center" font-weight="bold" border="none" border-radius="10px" href="${templateData[2]}" font-family="Helvetica" padding="16px 25px 8px 25px">${templateData[3]}</mj-button>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }