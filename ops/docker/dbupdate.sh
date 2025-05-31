dotnet tool install -g dotnet-ef
export PATH="$PATH:/root/.dotnet/tools"
cd /src/ProjectMainApp/Project.Data
rm /src/ProjectMainApp/Project.Data/appsettings.json
cp /src/ProjectMainApp/Project.Data/appsettings.dev.json /src/ProjectMainApp/Project.Data/appsettings.json
rm /src/ProjectMainApp/Project.Endpoint/appsettings.json
cp /src/ProjectMainApp/Project.Data/appsettings.dev.json /src/ProjectMainApp/Project.Endpoint/appsettings.json
dotnet ef database update --startup-project=../Project.Endpoint
echo "Database updated - D56F9D60-1659-46A5-9FFE-7DD5B0EB95B4"