Hammox.defmock(FunZoom.Test.MockAllNewsApi, for: FunZoom.NewsScraping.AllNewsApiContract)

ExUnit.start()
Ecto.Adapters.SQL.Sandbox.mode(FunZoom.Repo, :manual)