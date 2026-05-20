export const treeRootId = '1';
export const initialTree = {
  '1': {
    id: '1',
    name: 'father',
    type: 'input',
    image : "/mainprofile.png",
    children: ['3', '4'],
    spouses: ['2'],
  },
  '2': {
    id: '2',
    name: 'mother',
    image : "/mainprofile.png",
    isSpouse: true,
    children: ['3', '4'],
  },
  '3': {
    id: '3',
    name: 'child',
    image : "/mainprofile.png",
    parents: ['1', '2'],
    spouses: ['7'],
    children: ['8', '9'],
  },
  '4': {
    id: '4',
    name: 'child2',
    image : "/mainprofile.png",
    parents: ['1', '2'],
  },

  '7': {
    id: '7',
    name: 'child1 spouse',
    image : "/mainprofile.png",
    isSpouse: true,
    children: ['8', '9'],
  },
  '8': {
    id: '8',
    name: 'grandchild1',
    image : "/mainprofile.png",
    parents: ['3', '7'],
  },
  '9': {
    id: '9',
    name: 'grandchild2',
    image : "/mainprofile.png",
    parents: ['3', '7'],
  },
};
