'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { SITE_NAME } from '@/lib/site'
import SearchBar from './SearchBar'
import Categories from './CategoryList'
import Menu from './Menu'
import NavIcons from './NavIcons'
import MobileCartLink from './MobileCartLink'
import ThemeToggle from './ThemeToggle'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'

const Navbar = () => {
  const frame = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const searchRow = useRef<HTMLDivElement>(null)
  const natural = useRef<HTMLDivElement>(null)
  const { elevated, searchHidden } = useHeaderScroll(frame)
  // The home page carries its menu in the category row; every other page gets a menu button beside the logo instead.
  const onHome = usePathname() === '/'

  // The sticky frame keeps the header's full height even while the search row is folded, so the page below never shifts
  // (a shift would move the scroll position, and that would unfold the row again). Only the panel inside it changes size.
  const [reserve, setReserve] = useState<number | null>(null)
  useEffect(() => {
    const el = panel.current
    const slide = searchRow.current
    const row = natural.current
    if (!el || !slide || !row || typeof ResizeObserver === 'undefined') return
    // The full height, whatever the search row is doing: everything in the panel except the sliding part, plus the search
    // row at its natural height. Measuring the panel alone while the row slides would resize the frame and shift the page.
    const measure = () => {
      const full = Math.round(el.getBoundingClientRect().height - slide.getBoundingClientRect().height + row.getBoundingClientRect().height)
      setReserve((prev) => (prev !== null && Math.abs(prev - full) < 2 ? prev : full))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={frame}
      data-home-navbar={onHome || undefined}
      style={reserve ? ({ '--reserve': `${reserve}px` } as React.CSSProperties) : undefined}
      className='pointer-events-none sticky top-0 z-[45] h-[var(--reserve,auto)] md:pointer-events-auto md:h-20'
    >
    <div
      ref={panel}
      className={`pointer-events-auto bg-[var(--page)] pt-[env(safe-area-inset-top)] md:h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 transition-shadow duration-200 motion-reduce:transition-none ${
        elevated ? 'shadow-[0_8px_20px_-14px_rgba(0,0,0,0.45)]' : ''
      }`}
    >
      {/* Mobile Navbar: menu button on the left, logo in the middle, cart on the right, search underneath */}
      <div data-testid="phone-header" className='md:hidden border-b border-gray-200'>
        <div className='grid grid-cols-[1fr_auto_1fr] items-center h-14'>
          <div className='flex justify-start'>
            <Menu />
          </div>
          <Link href="/" aria-label={`${SITE_NAME}, home`} className='flex items-center h-11'>
            <span className='relative block h-[50px] aspect-[970/400]'>
              <Image
                src="/mwaleo-logo-horizontal.svg"
                alt={SITE_NAME}
                fill
                sizes="122px"
                loading="eager"
                className='object-contain dark:hidden'
              />
              <Image
                src="/mwaleo-logo-horizontal-reverse.svg"
                alt=""
                fill
                loading="eager"
                sizes="122px"
                className='hidden object-contain dark:block'
              />
            </span>
          </Link>
          <div className='flex items-center justify-end gap-1'>
            <ThemeToggle />
            <MobileCartLink />
          </div>
        </div>
        {/* The search row folds away while reading down the page and comes back at the first scroll up */}
        <div
          ref={searchRow}
          data-header-search
          aria-hidden={searchHidden || undefined}
          className={`grid transition-[grid-template-rows,visibility] duration-200 motion-reduce:transition-none ${
            searchHidden ? 'grid-rows-[0fr] invisible' : 'grid-rows-[1fr]'
          }`}
        >
          <div className='overflow-hidden'>
            <div ref={natural} className='pb-3'>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div data-testid="desktop-header" className='hidden md:flex items-center justify-between gap-8 h-full'>
        {/* Left Section */}
        <div className='flex flex-shrink-0 items-center gap-2'>
          {!onHome && <Menu />}
          <Link href="/" aria-label={`${SITE_NAME}, home`} className="flex items-center flex-shrink-0">
            <span className='relative block h-14 aspect-[970/400]'>
              <Image
                src="/mwaleo-logo-horizontal.svg"
                alt={SITE_NAME}
                fill
                sizes="160px"
                loading="eager"
                className='object-contain dark:hidden'
              />
              <Image
                src="/mwaleo-logo-horizontal-reverse.svg"
                alt=""
                fill
                loading="eager"
                sizes="160px"
                className='hidden object-contain dark:block'
              />
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className='flex flex-1 items-center justify-between gap-8'>
          <SearchBar />
          <div className='flex items-center gap-2'>
            <ThemeToggle />
            <NavIcons />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Navbar
