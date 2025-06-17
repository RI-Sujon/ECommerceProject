# dotnet tool install -g dotnet-ef
# echo "dotnet tool installed"
# export PATH="$PATH:/root/.dotnet/tools"
echo "echo - PATH set"
cd /src/ProjectMainApp/Project.Data
echo "echo - cd Project.Data"
rm /src/ProjectMainApp/Project.Data/appsettings.json
echo "echo - appsettings.json removed"
cp /src/ProjectMainApp/Project.Data/appsettings.dev.json /src/ProjectMainApp/Project.Data/appsettings.json
echo "echo - appsettings.dev.json copied to appsettings.json"
rm /src/ProjectMainApp/Project.Endpoint/appsettings.json
echo "echo - appsettings.json removed from Project.Endpoint"
cp /src/ProjectMainApp/Project.Data/appsettings.dev.json /src/ProjectMainApp/Project.Endpoint/appsettings.json
echo "echo - appsettings.dev.json copied to Project.Endpoint/appsettings.json"
dotnet ef database update --startup-project=../Project.Endpoint
echo "echo - Database updated - D56F9D60-1659-46A5-9FFE-7DD5B0EB95B4"