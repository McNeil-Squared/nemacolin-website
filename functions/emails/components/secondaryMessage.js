const build = (templateData) => {
  
  return `
    <mj-section background-color="#fff" padding="0px">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="15px" font-family="Helvetica" padding="0px 25px 16px 25px">${templateData[0]}</mj-text>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }
