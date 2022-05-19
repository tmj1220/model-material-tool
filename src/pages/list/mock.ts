export const tags = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '玻璃',
    value: 'boli',
  },
  {
    label: '塑料',
    value: 'suliao',
  },
  {
    label: '金属',
    value: 'jinshu',
  },
  {
    label: '光效',
    value: 'guangxiao',
  },
  {
    label: '布料',
    value: 'buliao',
  },
  {
    label: '毛发',
    value: 'maofa',
  },
  {
    label: '岩石',
    value: 'yanshi',
  },
]

const mockUrl1 = 'http://10.90.0.49:3011/mock1.png'
const mockUrl2 = 'http://10.90.0.49:3011/mock2.png'
const mockUrl3 = 'http://10.90.0.49:3011/mock3.png'
const mockUrl4 = 'http://10.90.0.49:3011/mock4.png'

export const baselist:BaseSource[] = [
  {
    id: '1',
    type: 'material',
    tags: [{
      label: '塑料',
      value: 'suliao',
    }],
    link: mockUrl1,
    name: '砖块墙面',
  },
  {
    id: '2',
    type: 'material',
    tags: [{
      label: '布料',
      value: 'buliao',
    }],
    link: mockUrl2,
    name: '布料材质',
  },
  {
    id: '3',
    type: 'material',
    tags: [{
      label: '岩石',
      value: 'yanshi',
    }],
    link: mockUrl3,
    name: '岩石材质',
  },
  {
    id: '4',
    type: 'material',
    tags: [{
      label: '光效',
      value: 'guangxiao',
    }],
    link: mockUrl4,
    name: '拼贴花纹',
  },
]
