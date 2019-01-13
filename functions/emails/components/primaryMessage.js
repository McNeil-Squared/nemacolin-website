const build = (templateData) => {
  
  return `
    <mj-section background-color="#fff" padding="0px">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="20px" font-family="Helvetica" padding="8px 25px 16px 25px"><strong>${templateData[0]}</strong></mj-text>
        <mj-image width="200px" src=${templateData[1]} alt=${templateData[2]} />
        <mj-text align="center" color="#333" font-size="16px" font-family="Helvetica" padding="24px 25px 30px 25px"><strong>${templateData[3]}</strong></mj-text>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }
