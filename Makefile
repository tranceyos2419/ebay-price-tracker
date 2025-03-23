run:
	@pnpm run dev
gen:
	@pnpx prisma generate
dpush:
	@pnpx prisma db push
build:
	@pnpm run build
seed:
	@pnpm run seed
studio:
	@pnpx prisma studio
