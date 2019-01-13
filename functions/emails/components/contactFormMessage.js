const build = (templateData) => {
  return `
    <mj-section background-color="#fff">
      <mj-column width="100%">
        <mj-text align="center" color="#333" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="16px 25px 0px 25px"><strong>${templateData[0]} said:</strong></mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper background-color="#fff" padding="0px 16px 24px">
      <mj-section background-color="#fff" padding="0px" border="1px solid #36413b">
        <mj-column width="100%">
          <mj-text align="left" color="#333" font-size="15px" font-family="Helvetica" padding="8px 16px">${templateData[1]}</mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  `
}

module.exports = { build }