defmodule FunZoom.Repo do
  use Ecto.Repo,
    otp_app: :fun_zoom,
    adapter: Ecto.Adapters.Postgres
end
