const build = (templateData) => {
  return `
    <mj-section background-color="#fff" padding="0px">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="16px" font-family="Helvetica" padding="8px 25px 16px 25px"><strong>${templateData[0]}</strong>
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#fff" padding="0px">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="15px" font-family="Helvetica" padding="8px 25px 4px 25px">${templateData[1]}</mj-text>
        <mj-text align="center" color="#333" font-size="15px" font-family="Helvetica" padding="4px 25px 16px 25px">${templateData[2]}</mj-text>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }