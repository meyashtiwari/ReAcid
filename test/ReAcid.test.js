const ReAcid = artifacts.require('./ReAcid.sol')

contract('ReAcid', (accounts) => {
  before(async () => {
    this.reAcid = await ReAcid.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.reAcid.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('List records', async () => {
    const recordCount = await this.reAcid.recordCount()
    const record = await this.reAcid.records(recordCount)
    assert.equal(record.id.toNumber(), recordCount.toNumber())
    assert.equal(record.name, 'Yash')
    assert.equal(record.phoneNumber, '8920958278')
    assert.equal(recordCount.toNumber(), 1)
  })

  it('Record Added', async () => {
    const result = await this.reAcid.createRecord('Shivani', '8744877306', 'H2SO4')
    const recordCount = await this.reAcid.recordCount()
    assert.equal(recordCount, 2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.name, 'Shivani')
    assert.equal(event.phoneNumber, '8744877306')
    assert.equal(event.typeOfAcid, 'H2SO4')
  })
})