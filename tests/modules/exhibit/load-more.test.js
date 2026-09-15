import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * 上拉加载更多功能测试
 * 验证 onReachBottom 生命周期和 loadMore 方法
 */

describe('上拉加载更多功能', () => {
  let mockComponent

  beforeEach(() => {
    global.uni = {
      showToast: vi.fn(),
    }

    // 模拟第一页数据（已加载）
    const firstPageList = [
      { id: 1, name: '清蒸武昌鱼', summary: '楚菜经典名菜', image: '/static/1.jpg', type: 'dish' },
      { id: 2, name: '排骨藕汤', summary: '湖北家常汤品', image: '/static/2.jpg', type: 'dish' },
    ]

    // 模拟第二页数据（待加载）
    const secondPageList = [
      { id: 3, name: '沔阳三蒸', summary: '传统蒸菜技艺', image: '/static/3.jpg', type: 'dish' },
      { id: 4, name: '红菜薹炒腊肉', summary: '武汉冬季时令名菜', image: '/static/4.jpg', type: 'dish' },
    ]

    // 模拟 exhibitApi.getExhibitList
    const mockGetExhibitList = vi.fn().mockResolvedValue({
      list: secondPageList,
      total: 4,
      hasMore: false,
    })

    // 模拟组件实例，与 list.vue 的 data/methods 结构保持一致
    mockComponent = {
      activeTab: 'dish',
      isLoading: false,
      isLoadingMore: false,
      list: [...firstPageList],
      total: 4,
      hasMore: true,
      page: 1,
      pageSize: 2,
      _mockGetExhibitList: mockGetExhibitList,

      async loadMore() {
        if (this.isLoadingMore || !this.hasMore || this.isLoading) {
          return
        }
        this.isLoadingMore = true
        const nextPage = this.page + 1
        try {
          const result = await this._mockGetExhibitList({
            type: this.activeTab,
            page: nextPage,
            pageSize: this.pageSize,
          })
          const mapped = (result.list || []).map((item) => ({
            id: item.id,
            name: item.name || '',
            summary: item.summary || item.history || item.bio || '',
            image: item.image || item.photo || '',
            type: item.type || this.activeTab,
          }))
          this.list = this.list.concat(mapped)
          this.page = nextPage
          this.total = result.total || 0
          this.hasMore = result.hasMore || false
        } catch (error) {
          uni.showToast({ title: error.message || '加载失败', icon: 'none' })
        } finally {
          this.isLoadingMore = false
        }
      },

      onReachBottom() {
        this.loadMore()
      },
    }
  })

  it('触底加载下一页，数据应追加到 list 末尾', async () => {
    const originalLength = mockComponent.list.length
    expect(originalLength).toBe(2)

    await mockComponent.loadMore()

    expect(mockComponent.list).toHaveLength(4)
    expect(mockComponent.list[0].id).toBe(1)
    expect(mockComponent.list[2].id).toBe(3)
    expect(mockComponent.list[3].id).toBe(4)
  })

  it('触底加载后 page 应递增', async () => {
    expect(mockComponent.page).toBe(1)

    await mockComponent.loadMore()

    expect(mockComponent.page).toBe(2)
  })

  it('触底加载后 hasMore 应根据接口返回更新', async () => {
    expect(mockComponent.hasMore).toBe(true)

    await mockComponent.loadMore()

    expect(mockComponent.hasMore).toBe(false)
  })

  it('hasMore 为 false 时不发起请求', async () => {
    mockComponent.hasMore = false

    await mockComponent.loadMore()

    expect(mockComponent._mockGetExhibitList).not.toHaveBeenCalled()
    expect(mockComponent.list).toHaveLength(2)
  })

  it('isLoadingMore 为 true 时不重复发起请求', async () => {
    mockComponent.isLoadingMore = true

    await mockComponent.loadMore()

    expect(mockComponent._mockGetExhibitList).not.toHaveBeenCalled()
    expect(mockComponent.list).toHaveLength(2)
  })

  it('isLoading 为 true 时不发起请求', async () => {
    mockComponent.isLoading = true

    await mockComponent.loadMore()

    expect(mockComponent._mockGetExhibitList).not.toHaveBeenCalled()
    expect(mockComponent.list).toHaveLength(2)
  })

  it('加载过程中 isLoadingMore 应为 true，加载完成后重置为 false', async () => {
    let capturedDuringLoad = null
    mockComponent._mockGetExhibitList = vi.fn().mockImplementation(async () => {
      capturedDuringLoad = mockComponent.isLoadingMore
      return { list: [], total: 2, hasMore: false }
    })

    expect(mockComponent.isLoadingMore).toBe(false)
    await mockComponent.loadMore()

    expect(capturedDuringLoad).toBe(true)
    expect(mockComponent.isLoadingMore).toBe(false)
  })

  it('加载失败时 isLoadingMore 应重置为 false', async () => {
    mockComponent._mockGetExhibitList = vi.fn().mockRejectedValue(new Error('网络错误'))

    await mockComponent.loadMore()

    expect(mockComponent.isLoadingMore).toBe(false)
  })

  it('加载失败时应调用 uni.showToast 显示错误信息', async () => {
    mockComponent._mockGetExhibitList = vi.fn().mockRejectedValue(new Error('网络错误'))

    await mockComponent.loadMore()

    expect(uni.showToast).toHaveBeenCalledWith({
      title: '网络错误',
      icon: 'none',
    })
  })

  it('加载失败时原有列表数据应保持不变', async () => {
    const originalList = [...mockComponent.list]
    mockComponent._mockGetExhibitList = vi.fn().mockRejectedValue(new Error('网络错误'))

    await mockComponent.loadMore()

    expect(mockComponent.list).toEqual(originalList)
  })

  it('onReachBottom 应调用 loadMore', async () => {
    const loadMoreSpy = vi.spyOn(mockComponent, 'loadMore')

    mockComponent.onReachBottom()

    expect(loadMoreSpy).toHaveBeenCalled()
  })

  it('接口返回字段映射正确（history/bio 映射为 summary，photo 映射为 image）', async () => {
    mockComponent._mockGetExhibitList = vi.fn().mockResolvedValue({
      list: [
        { id: 5, name: '东坡肉', history: '苏东坡所创', photo: '/static/5.jpg', type: 'dish' },
      ],
      total: 3,
      hasMore: false,
    })

    await mockComponent.loadMore()

    const appended = mockComponent.list[2]
    expect(appended.summary).toBe('苏东坡所创')
    expect(appended.image).toBe('/static/5.jpg')
  })
})
