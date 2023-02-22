import test from 'tape'
import f from '../'

test('class instatiation', t => {
  const A = f(class A {
    constructor(name) {
      this.name = name
    }
  })
  const withNew = new A('withNew')
  const withoutNew = A('withoutNew')
  t.ok(withNew, 'withNew is sane')
  t.ok(withNew instanceof A, 'withNew is instance of A')
  t.equal(withNew.name, 'withNew', 'withNew has instance property')

  t.ok(withoutNew, 'withoutNew is sane')
  t.ok(withoutNew instanceof A, 'withoutNew is instance of A')
  t.ok(withoutNew.name, 'withoutNew', 'withoutNew has instance property')
  t.end()
})

test('proto methods', t => {
  const expected = Symbol()
  const A = f(class A {
    test() {
      return expected
    }
  })

  const withNew = new A()
  const withoutNew = A()
  t.equal(withNew.test(), expected, 'proto method with new')
  t.equal(withoutNew.test(), expected, 'proto method without new')
  t.end()
})

test('static properties', t => {
  const expected = Symbol()
  class A { }
  A.property = expected
  const B = f(A)


  t.equal(B.property, expected, 'static property exists')
  t.end()
})

test('inheritance', t => {
  const expected = Symbol()
  class A {
    constructor(name) {
      this.name = name
    }
    test() {
      return expected
    }
  }
  A.property = expected

  const B = f(A)

  const C = f(class C extends A {
    constructor(name) {
      super(name.toUpperCase())
    }
    test2() {
      return super.test()
    }
  })

  t.equal(B.property, expected, 'static property exists')

  const withNew = new C('withNew')
  const withoutNew = C('withoutNew')

  t.equal(withNew.name, 'WITHNEW', 'withNew has instance property')
  t.equal(withoutNew.name, 'WITHOUTNEW', 'withoutNew has instance property')

  t.equal(withNew.test(), expected, 'withNew inherited proto method call')
  t.equal(withoutNew.test(), expected, 'withoutNew inherited proto method call')
  t.equal(withNew.test2(), expected, 'withNew inherited proto method call')
  t.equal(withoutNew.test2(), expected, 'withoutNew inherited proto method call')
  t.end()
})
