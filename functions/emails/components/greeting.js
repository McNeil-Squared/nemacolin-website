const build = (templateData) => {
  return `
    <mj-section background-color="#fff" padding="0px">
      <mj-column width="100%">
        <mj-text align="center" font-size="18px" color="#333" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="24px 25px 16px 25px">Hi ${templateData[0]}
        </mj-text>
      </mj-column>
    </mj-section>
  `
}

module.exports = { build }