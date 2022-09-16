import Link from 'src/components/ui/Link'

export interface HeaderLinkProps {
  name: string
  link: string
}

function HeaderLink({ name, link }: HeaderLinkProps) {
  if (link) {
    return (
      <div className="link">
        <Link data-fs-navlinks-link variant="display" href={link}>
          {name}
        </Link>
      </div>
    )
  }

  return (
    <div className="link">
      <Link data-fs-navlinks-link variant="display" href="/#">
        {name}
      </Link>
    </div>
  )
}

export default HeaderLink
