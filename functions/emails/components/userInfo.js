const build = (templateData) => {
  return `
    <mj-section background-color="#fff" padding="0px 16px">
      <mj-column background-color="#1b211f">
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="24px 25px 8px 25px"><strong>${templateData[0]}</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="14px" font-family="Helvetica" padding="8px 25px 24px 25px">${templateData[1]}</mj-text>
      </mj-column>
      <mj-column background-color="#1b211f">
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="24px 25px 8px 25px"><strong>${templateData[2]}</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="14px" font-family="Helvetica" padding="8px 25px 24px 25px">${templateData[3]}</mj-text>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }