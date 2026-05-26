import { describe, it, expect } from 'vitest'
import { pickRouteParam } from '@/shared/utils/route-query.js'

describe('pickRouteParam', () => {
  it('正常获取参数', () => {
    const options = { id: '123', name: 'test' }
    expect(pickRouteParam(options, 'id')).toBe('123')
    expect(pickRouteParam(options, 'name')).toBe('test')
  })

  it('参数不存在时返回 null', () => {
    const options = { id: '123' }
    expect(pickRouteParam(options, 'name')).toBeNull()
  })

  it('options 为 undefined 时返回 null', () => {
    expect(pickRouteParam(undefined, 'id')).toBeNull()
  })

  it('options 为 null 时返回 null', () => {
    expect(pickRouteParam(null, 'id')).toBeNull()
  })

  it('key 为空时返回 null', () => {
    const options = { id: '123' }
    expect(pickRouteParam(options, '')).toBeNull()
    expect(pickRouteParam(options, null)).toBeNull()
  })

  it('参数值为数字时转为字符串', () => {
    const options = { id: 123 }
    expect(pickRouteParam(options, 'id')).toBe('123')
  })

  it('参数值为 0 时返回 "0"', () => {
    const options = { page: 0 }
    expect(pickRouteParam(options, 'page')).toBe('0')
  })

  it('参数值为空字符串时返回空字符串', () => {
    const options = { name: '' }
    expect(pickRouteParam(options, 'name')).toBe('')
  })
})
