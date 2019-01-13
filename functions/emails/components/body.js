const build = (contents) => {
  return `
    <mjml>
      <mj-body background-color="#ccc">
        ${contents}
      </mj-body>
    </mjml>
  `
}

module.exports = { build }